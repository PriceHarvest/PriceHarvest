/**
 * PriceHarvest — Live Mandi Prices
 * Official Agmarknet data via data.gov.in
 * Resource ID: 9ef84268-d588-465a-a308-a864a43d0070
 *
 * Data is fetched through server.py (/api/mandi); the API key lives in .env, never in the browser.
 */
(function() {
    "use strict";

    // ─── CONFIG ───────────────────────────────────────────────────────────────

    const PROJECT_CROPS = ["Onion", "Tomato", "Potato", "Spinach", "Cabbage"];

    // ─── DOM (safe) ───────────────────────────────────────────────────────────
    const elState = document.getElementById("mandiState");
    const elMarket = document.getElementById("mandiMarket");
    const elCommodity = document.getElementById("mandiCommodity");
    const elBtn = document.getElementById("mandiSearchBtn");
    const elStatus = document.getElementById("mandiStatus");
    const elBody = document.getElementById("mandiBody");

    if (!elBtn || !elStatus || !elBody || !elState || !elMarket || !elCommodity) {
        console.error("mandi.js: required HTML elements not found. Check mandi.html ids.");
        return;
    }

    // ─── HELPERS ──────────────────────────────────────────────────────────────
    function setStatus(msg, type) {
        elStatus.textContent = msg;
        elStatus.className = "mandi-status" + (type ? " " + type : "");
    }

    function formatPrice(v) {
        if (v === null || v === undefined || v === "" || v === "NA" || v === "N/A") {
            return "—";
        }
        var n = Number(String(v).replace(/,/g, ""));
        if (isNaN(n)) return String(v);
        return "₹" + n.toLocaleString("en-IN");
    }

    function formatDate(d) {
        if (!d) return "—";
        var s = String(d).trim();
        var m1 = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (m1) {
            return (
                m1[1].padStart(2, "0") +
                "/" +
                m1[2].padStart(2, "0") +
                "/" +
                m1[3]
            );
        }
        var m2 = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m2) {
            return m2[3] + "/" + m2[2] + "/" + m2[1];
        }
        return s;
    }

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function pick(obj, keys) {
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
                return obj[k];
            }
        }
        return "";
    }

    function normalizeRecord(r) {
        if (!r || typeof r !== "object") return null;
        return {
            commodity: pick(r, ["commodity", "Commodity"]),
            variety: pick(r, ["variety", "Variety"]),
            grade: pick(r, ["grade", "Grade"]),
            state: pick(r, ["state", "State"]),
            district: pick(r, ["district", "District"]),
            market: pick(r, ["market", "Market"]),
            min_price: pick(r, ["min_price", "Min_Price", "min", "Min Price"]),
            max_price: pick(r, ["max_price", "Max_Price", "max", "Max Price"]),
            modal_price: pick(r, ["modal_price", "Modal_Price", "modal", "Modal Price", "Model Prize"]),
            arrival_date: pick(r, [
                "arrival_date",
                "Arrival_Date",
                "arrivalDate",
                "date",
                "Date",
            ]),
        };
    }

    function renderRows(records) {
        if (!records || records.length === 0) {
            elBody.innerHTML =
                '<tr><td colspan="6" class="mandi-empty">' +
                "<strong>No records found</strong>" +
                "Try another market or commodity, or check that today’s data has been uploaded to Agmarknet." +
                "</td></tr>";
            return;
        }

        var cropOrder = {};
        PROJECT_CROPS.forEach(function(c, i) {
            cropOrder[c.toLowerCase()] = i;
        });

        records.sort(function(a, b) {
            var ca = cropOrder[(a.commodity || "").toLowerCase()];
            var cb = cropOrder[(b.commodity || "").toLowerCase()];
            if (ca !== undefined && cb !== undefined && ca !== cb) return ca - cb;
            if (ca !== undefined && cb === undefined) return -1;
            if (ca === undefined && cb !== undefined) return 1;
            var ma = Number(a.modal_price) || 0;
            var mb = Number(b.modal_price) || 0;
            return mb - ma;
        });

        elBody.innerHTML = records
            .map(function(r) {
                var varietyHtml = r.variety ?
                    '<span class="mandi-variety">' + escapeHtml(r.variety) + "</span>" :
                    "";
                var distLine = [r.district, r.state].filter(Boolean).join(", ");
                return (
                    "<tr>" +
                    '<td><div class="mandi-commodity">' +
                    escapeHtml(r.commodity || "—") +
                    "</div>" +
                    varietyHtml +
                    "</td>" +
                    '<td><div class="mandi-market">' +
                    escapeHtml(r.market || "—") +
                    (distLine ?
                        "<small>📍 " + escapeHtml(distLine) + "</small>" :
                        "") +
                    "</div></td>" +
                    '<td class="mandi-price">' +
                    formatPrice(r.min_price) +
                    "</td>" +
                    '<td class="mandi-price">' +
                    formatPrice(r.max_price) +
                    "</td>" +
                    '<td class="mandi-modal mandi-price">' +
                    formatPrice(r.modal_price) +
                    '<span class="unit">PER QUINTAL</span></td>' +
                    '<td class="mandi-date">📅 ' +
                    formatDate(r.arrival_date) +
                    "</td>" +
                    "</tr>"
                );
            })
            .join("");
    }

    async function fetchPrices() {
        var market = (elMarket.value || "").trim();
        var commodity = (elCommodity.value || "").trim();

        elBtn.disabled = true;
        setStatus("Fetching live prices from Agmarknet…", "loading");
        elBody.innerHTML =
            '<tr><td colspan="6" class="mandi-empty"><strong>Loading…</strong>Contacting PriceHarvest server</td></tr>';

        try {
            var url = "/api/mandi?city=" + encodeURIComponent(market) +
                "&crop=" + encodeURIComponent(commodity || "All");
            var res = await fetch(url, { headers: { Accept: "application/json" } });
            var data;
            try { data = await res.json(); } catch (e) {
                throw new Error("Server did not return JSON. Run python server.py and open http://localhost:8000/mandi.html (not file://).");
            }
            if (!res.ok || data.error) throw new Error(data.error || ("HTTP " + res.status));

            var all = (data.records || []).map(function(r) {
                return {
                    commodity: r.commodity || r.crop, variety: r.variety, grade: r.grade,
                    state: r.state, district: r.district, market: r.market,
                    min_price: r.min, max_price: r.max, modal_price: r.modal,
                    arrival_date: r.date
                };
            });
            renderRows(all);
            if (all.length === 0) {
                setStatus("No records from data.gov.in for this selection today. Mandis upload during the day; try All Markets or another crop.", "error");
            } else {
                setStatus("Showing " + all.length + " record(s) from official Agmarknet data.", "ok");
            }
        } catch (err) {
            console.error(err);
            renderRows([]);
            setStatus("Could not load prices: " + (err && err.message ? err.message : err), "error");
        } finally {
            elBtn.disabled = false;
        }
    }

    // ─── EVENTS ───────────────────────────────────────────────────────────────
    elBtn.addEventListener("click", fetchPrices);

    document.querySelectorAll(".mandi-chip").forEach(function(chip) {
        chip.addEventListener("click", function() {
            elCommodity.value = chip.getAttribute("data-c") || "";
            elMarket.value = chip.getAttribute("data-m") || "";
            elState.value = "Maharashtra";
            fetchPrices();
        });
    });

    // Optional: auto-load on open
    // setTimeout(fetchPrices, 600);
})();