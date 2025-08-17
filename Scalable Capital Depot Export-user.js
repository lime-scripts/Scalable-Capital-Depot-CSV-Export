// ==UserScript==
// @name         Scalable Capital Depot
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Extend Scalable Capital with additional functionality
// @author       https://github.com/lime-scripts
// @match        https://de.scalable.capital/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scalable.capital
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';


    GM_registerMenuCommand("Export Depot CSV", function () {
        const positions = findPositions();
        const csv = toCsv(positions);
        downloadCsv(csv, "ScalableNeu_depot_export_" + (new Date().toISOString().split(".")[0]) + ".csv");
    });


    GM_registerMenuCommand("Guthaben kopieren", function () {
        const deposit = getDeposit();
        if (deposit === undefined) {
            alert("Fehler: Guthaben konnte nicht kopiert werden");
            return;
        }
        navigator.clipboard.writeText("" + deposit);
    });


    function isObject(obj) {
        return typeof obj === "object" && obj !== null;
    }


    function findPositions() {

        let resultsMap = {};

        function visit(node) {
            if (!node) {
                return;
            }
            else if (Array.isArray(node)) {
                for (const subNode of node) {
                    visit(subNode);
                }
            }
            else if (isObject(node)) {
                if (node["isin"] && node["inventory"]) {
                    resultsMap[node["isin"]] = { ...node };
                }
                else {
                    for (const key of Object.keys(node)) {
                        if (["children", "props", "security", "items"].includes(key) || key.startsWith("__reactProps")) {
                            visit(node[key]);
                        }
                    }
                }
            }
            if (node.childNodes) {
                node.childNodes.forEach(n => { visit(n); });
            }
        }

        visit(document.body);
        const positions = Array.from(Object.values(resultsMap)).map(pos => ({
            isin: pos.isin,
            name: pos.name,
            amount: pos.inventory.position?.filled,
            price: pos.inventory.position?.fifoPrice,
            data: pos,
            lastPrice: pos.quoteTick?.midPrice
        }));
        positions.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
        console.log(positions.length, "Positionen");
        return positions;
    }


    function findPropsLeafNodes(el) {
        if (!el) {
            return [];
        }
        const props = el[Object.keys(el).find(key => key.startsWith("__reactProps"))];
        if (!props) {
            return [];
        }

        const resultNodes = [];

        function visit(node) {
            if (!node) {
                return;
            }
            else if (Array.isArray(node)) {
                for (const subNode of node) {
                    visit(subNode);
                }
            }
            else if (isObject(node)) {
                if ((!node.children || Array.isArray(node.children) && node.children.length === 0) && !node.props) {
                    resultNodes.push(node);
                }
                else {
                    for (const key of Object.keys(node)) {
                        if (["children", "props"].includes(key)) {
                            visit(node[key]);
                        }
                    }
                }
            }
        }

        visit(props);
        return resultNodes;

    }

    function getDeposit() {
        const nodes = findPropsLeafNodes(
            Array.from(document.querySelectorAll("button"))
                .filter(el => el.className.includes("cashBreakdownButton"))[0]
        );
        return nodes.filter(n => n.value !== undefined)[0]?.value;
    }



    function toCsv(rows) {
        const SEP = ";";
        const LINE_SEP = "\n";
        const csvRows = [];
        for (let i = -1; i < rows.length; i++) {
            const row = rows[i];
            const csvRow = Array(5).fill("");
            csvRow[0] = i >= 0 ? row.name : "Name";
            csvRow[1] = i >= 0 ? row.isin : "ISIN";
            csvRow[2] = i >= 0 ? "" + row.amount : "Anzahl";
            csvRow[3] = i >= 0 ? "" + row.price : "Preis";
            csvRow[4] = i >= 0 ? "" + row.lastPrice : "Letzter Preis";
            csvRows.push(csvRow);
        }
        const csv = csvRows.map(row => row.map(val => val.replaceAll(SEP, "")).join(SEP)).join(LINE_SEP);
        return csv;
    }


    function downloadCsv(csv, filename) {
        const data = "data:text/csv;charset=utf-8," + csv;
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(data));
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

})();
