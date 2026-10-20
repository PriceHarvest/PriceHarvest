(function() {
    var META = {
        "Kolhapur|Cabbage": { src: "G", model: "XGB", vm: 23.77, vb: 26.26, tm: 27.97, tb: 30.67, lo: 1026, hi: 1494, ql: 369, qh: 2264 },
        "Kolhapur|Onion": { src: "G", model: "Global", vm: 17.69, vb: 24.09, tm: 5.70, tb: 12.84, lo: 1314, hi: 1366, ql: 1060, qh: 2692 },
        "Kolhapur|Potato": { src: "S", model: "XGB", vm: 20.51, vb: 25.13, tm: 8.88, tb: 6.83, lo: 1812, hi: 1895, ql: 1485, qh: 2457 },
        "Kolhapur|Spinach": { src: "S", model: "XGB", vm: 12.71, vb: 20.42, tm: 20.54, tb: 22.72, lo: 503, hi: 518, ql: 298, qh: 798 },
        "Kolhapur|Tomato": { src: "G", model: "LGBM", vm: 12.25, vb: 16.28, tm: 37.27, tb: 34.13, lo: 1367, hi: 1773, ql: 535, qh: 5184 },
        "Mumbai|Cabbage": { src: "G", model: "XGB", vm: 18.36, vb: 18.56, tm: 25.16, tb: 46.46, lo: 1422, hi: 1822, ql: 661, qh: 2234 },
        "Mumbai|Onion": { src: "G", model: "LGBM", vm: 8.04, vb: 9.50, tm: 17.48, tb: 24.95, lo: 1666, hi: 1751, ql: 907, qh: 3755 },
        "Mumbai|Potato": { src: "G", model: "Global", vm: 10.53, vb: 6.66, tm: 8.50, tb: 5.47, lo: 1075, hi: 1165, ql: 1026, qh: 1862 },
        "Mumbai|Spinach": { src: "G", model: "Global", vm: 11.85, vb: 13.67, tm: 27.96, tb: 34.55, lo: 1050, hi: 1188, ql: 503, qh: 1514 },
        "Mumbai|Tomato": { src: "G", model: "Global", vm: 18.35, vb: 17.81, tm: 22.59, tb: 29.79, lo: 2468, hi: 2851, ql: 1030, qh: 8994 },
        "Nagpur|Cabbage": { src: "G", model: "Global", vm: 19.82, vb: 20.94, tm: 26.26, tb: 38.41, lo: 1619, hi: 1788, ql: 473, qh: 2628 },
        "Nagpur|Onion": { src: "G", model: "XGB", vm: 9.06, vb: 9.05, tm: 20.63, tb: 18.34, lo: 1788, hi: 1906, ql: 1196, qh: 3891 },
        "Nagpur|Potato": { src: "G", model: "Global", vm: 20.05, vb: 24.11, tm: 13.50, tb: 11.46, lo: 1416, hi: 1517, ql: 1135, qh: 2305 },
        "Nagpur|Spinach": { src: "G", model: "XGB", vm: 10.71, vb: 16.74, tm: 40.01, tb: 50.36, lo: 2482, hi: 2830, ql: 914, qh: 4983 },
        "Nagpur|Tomato": { src: "G", model: "LGBM", vm: 17.23, vb: 28.84, tm: 37.91, tb: 38.52, lo: 2413, hi: 2728, ql: 931, qh: 4722 },
        "Nashik|Cabbage": { src: "G", model: "Global", vm: 37.54, vb: 35.89, tm: 36.36, tb: 58.40, lo: 1402, hi: 1454, ql: 361, qh: 2140 },
        "Nashik|Onion": { src: "G", model: "LGBM", vm: 10.88, vb: 10.04, tm: 27.33, tb: 22.79, lo: 1785, hi: 2015, ql: 846, qh: 3442 },
        "Nashik|Potato": { src: "G", model: "Global", vm: 6.69, vb: 3.91, tm: 8.47, tb: 13.23, lo: 856, hi: 940, ql: 705, qh: 1458 },
        "Nashik|Spinach": { src: "G", model: "Global", vm: 16.54, vb: 18.82, tm: 14.01, tb: 24.74, lo: 448, hi: 551, ql: 261, qh: 917 },
        "Nashik|Tomato": { src: "G", model: "Global", vm: 39.63, vb: 41.55, tm: 25.02, tb: 27.35, lo: 1715, hi: 2189, ql: 371, qh: 3557 },
        "Ratnagiri|Cabbage": { src: "S", model: "Global", vm: 13.46, vb: 11.67, tm: 35.90, tb: 46.13, lo: 2649, hi: 2706, ql: 1182, qh: 3854 },
        "Ratnagiri|Onion": { src: "S", model: "Global", vm: 10.72, vb: 24.87, tm: 13.24, tb: 23.19, lo: 1269, hi: 1288, ql: 911, qh: 3046 },
        "Ratnagiri|Potato": { src: "S", model: "Global", vm: 17.18, vb: 18.06, tm: 13.55, tb: 7.58, lo: 1036, hi: 1169, ql: 976, qh: 1874 },
        "Ratnagiri|Spinach": { src: "S", model: "XGB", vm: 14.12, vb: 27.91, tm: 8.93, tb: 9.53, lo: 1356, hi: 1497, ql: 1035, qh: 2292 },
        "Ratnagiri|Tomato": { src: "G", model: "XGB", vm: 6.41, vb: 7.15, tm: 36.34, tb: 35.80, lo: 1603, hi: 2144, ql: 680, qh: 4532 }
    };

    var MN = {
        Global: "Global Cross-Series LightGBM",
        XGB: "Per-Series XGBoost",
        LGBM: "Per-Series LightGBM"
    };

    var $ = function(id) { return document.getElementById(id); };
    var inr = function(v) { return "₹" + Math.round(v).toLocaleString("en-IN"); };
    var kg = function(v) { return "₹" + (v / 100).toFixed(1); };

    function kpi(v, l) {
        return '<div class="esum-item"><span class="esum-val">' + v + '</span><span class="esum-lbl">' + l + '</span></div>';
    }

    function heroCard(lo, hi, err, sub) {
        return '<div class="ph-chart" style="text-align:center;padding:2rem 1rem">' +
            '<div style="font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;color:#7A8299">Expected price range · next 30 days</div>' +
            '<div style="font-family:\'Cormorant Garamond\',serif;font-size:clamp(2rem,6vw,3.4rem);color:#1A4731;font-weight:700;margin:.4rem 0">' +
            inr(lo) + ' – ' + inr(hi) +
            ' <span style="font-size:1rem;font-weight:500;color:#7A8299">/ Quintal</span></div>' +
            '<div style="color:#4B5563">≈ ' + kg(lo) + ' – ' + kg(hi) + ' per kg &nbsp;·&nbsp; typical model error ±' + err.toFixed(0) + '%</div>' +
            (sub ? '<div style="margin-top:.6rem;font-size:.85rem;color:#7A8299">' + sub + '</div>' : '') +
            '</div>';
    }

    function chart(F) {
        var n = F.dates.length,
            W = 900,
            H = 380,
            L = 70,
            R = 20,
            T = 20,
            B = 50;
        var hasH = F.hist && F.hist.y && F.hist.y.length;
        var all = F.p10.concat(F.p90, F.point, hasH ? F.hist.y : []);
        var lo = Math.min.apply(null, all),
            hi = Math.max.apply(null, all);
        var pad = (hi - lo) * 0.05;
        lo = Math.max(0, lo - pad);
        hi += pad;

        var hn = hasH ? F.hist.y.length : 0,
            tot = hn + n;
        var x = function(i) { return L + i * (W - L - R) / (tot - 1); };
        var y = function(v) { return T + (hi - v) * (H - T - B) / (hi - lo); };

        var band = F.p90.map(function(v, i) { return x(hn + i) + "," + y(v); })
            .concat(F.p10.map(function(v, i) { return [x(hn + i), y(v)]; }).reverse().map(function(q) { return q.join(","); }))
            .join(" ");

        var line = F.point.map(function(v, i) { return x(hn + i) + "," + y(v); }).join(" ");
        var g = "";
        for (var k = 0; k <= 5; k++) {
            var v = lo + (hi - lo) * k / 5;
            g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#e5e7eb"/>' +
                '<text x="' + (L - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end" font-size="11" fill="#7A8299">' +
                Math.round(v).toLocaleString("en-IN") + '</text>';
        }

        var labs = hasH ? F.hist.dates.concat(F.dates) : F.dates;
        for (var i = 0; i < tot; i += Math.ceil(tot / 8)) {
            g += '<text x="' + x(i) + '" y="' + (H - 25) + '" text-anchor="middle" font-size="11" fill="#7A8299">' + labs[i].slice(5) + '</text>';
        }

        var hl = hasH ?
            '<polyline points="' + F.hist.y.map(function(v, i) { return x(i) + "," + y(v); }).join(" ") + '" fill="none" stroke="#64748B" stroke-width="2"/>' +
            '<line x1="' + x(hn - 1) + '" x2="' + x(hn - 1) + '" y1="' + T + '" y2="' + (H - B) + '" stroke="#94A3B8" stroke-dasharray="4 4"/>' :
            '';

        var dots = F.point.map(function(v, i) {
            return '<circle cx="' + x(hn + i) + '" cy="' + y(v) + '" r="4" fill="#1A4731" data-i="' + i + '" style="cursor:pointer"/>';
        }).join("");

        return '<svg viewBox="0 0 ' + W + ' ' + H + '">' +
            g + hl +
            '<polygon points="' + band + '" fill="#C9922A" opacity=".22"/>' +
            '<polyline points="' + line + '" fill="none" stroke="#1A4731" stroke-width="2.5"/>' +
            dots +
            '<text x="14" y="' + (H / 2) + '" transform="rotate(-90 14 ' + (H / 2) + ')" text-anchor="middle" font-size="11" fill="#7A8299">₹ / Quintal</text>' +
            '<text x="' + (L + 10) + '" y="' + (H - 6) + '" font-size="12" fill="#1A4731">— predicted</text>' +
            '<text x="' + (L + 130) + '" y="' + (H - 6) + '" font-size="12" fill="#C9922A">■ 80% interval (p10–p90)</text>' +
            (hasH ? '<text x="' + (L + 330) + '" y="' + (H - 6) + '" font-size="12" fill="#64748B">— recent actual</text>' : '') +
            '</svg><div class="ph-tip" id="phTip"></div>';
    }

    function rangeBar(m, e) {
        var elo = m.lo * (1 - e),
            ehi = m.hi * (1 + e);
        var span = ehi - elo;
        var l = (m.lo - elo) / span * 100;
        var w = (m.hi - m.lo) / span * 100;
        return '<div class="ph-chart" style="padding:1.5rem 2rem">' +
            '<div style="display:flex;justify-content:space-between;font-size:.85rem;color:#7A8299"><span>' + inr(elo) + '</span><span>' + inr(ehi) + '</span></div>' +
            '<div style="position:relative;height:18px;background:#FEF3C7;border-radius:99px;margin:.5rem 0">' +
            '<div style="position:absolute;left:' + l + '%;width:' + Math.max(w, 1.5) + '%;top:0;bottom:0;background:#1A4731;border-radius:99px"></div>' +
            '</div>' +
            '<div style="font-size:.85rem;color:#4B5563;text-align:center">' +
            '<b style="color:#1A4731">Dark bar</b>: model\'s predicted price range (' + inr(m.lo) + ' – ' + inr(m.hi) + ')' +
            ' &nbsp;·&nbsp; <b style="color:#C9922A">Light band</b>: expected range after allowing for typical test error' +
            '</div></div>';
    }

    function run() {
        var c = $("phCity").value,
            k = $("phCrop").value;
        var key = c + "|" + k,
            m = META[key];
        var D = window.PH_FORECASTS,
            F = D && D.series && D.series[key];
        var err = m.tm / 100;

        var prov = m.src === "S" ?
            '<span class="ph-badge warn">Synthetic history — extra caution</span>' :
            '<span class="ph-badge">Government (real) history</span>';

        var beats = m.tm < m.tb ?
            '<span class="ph-badge">Beat baseline on test (' + m.tb.toFixed(1) + '%)</span>' :
            '<span class="ph-badge warn">Did not beat baseline on test (' + m.tb.toFixed(1) + '%)</span>';

        $("phBadges").innerHTML =
            '<span class="ph-badge blue">Model: ' + MN[m.model] + '</span>' +
            prov +
            '<span class="ph-badge blue">Test MAPE ' + m.tm.toFixed(1) + '%</span>' +
            '<span class="ph-badge">Val MAPE ' + m.vm.toFixed(1) + '%</span>' +
            beats;

        $("phFallback").innerHTML = "";

        if (F) {
            var p = F.point,
                n = p.length;
            var mn = Math.min.apply(null, p),
                mx = Math.max.apply(null, p);
            var avg = p.reduce(function(a, b) { return a + b; }, 0) / n;
            var ch = (p[n - 1] - p[0]) / p[0] * 100;

            $("phHero").innerHTML = heroCard(mn * (1 - err), mx * (1 + err), err * 100,
                "Model’s predicted range " + inr(mn) + " – " + inr(mx) + " · average " + inr(avg));

            var pick = [0, Math.floor(n / 4), Math.floor(n / 2), n - 1]
                .filter(function(v, i, a) { return a.indexOf(v) === i; });

            $("phKpi").innerHTML = pick.map(function(i, j) {
                    return (j ? '<div class="esum-div"></div>' : '') +
                        kpi(inr(p[i]), "Day " + (i + 1) + " · " + F.dates[i] +
                            " · " + inr(p[i] * (1 - err)) + "–" + inr(p[i] * (1 + err)));
                }).join("") +
                '<div class="esum-div"></div>' +
                kpi((ch >= 0 ? "+" : "") + ch.toFixed(1) + "%", "Change day 1 → day " + n);

            $("phChart").style.display = "";
            $("phChart").innerHTML = chart(F);

            var tip = $("phTip"),
                box = $("phChart");
            box.querySelectorAll("circle").forEach(function(el) {
                el.addEventListener("mouseenter", function() {
                    var i = +el.dataset.i;
                    tip.style.display = "block";
                    tip.innerHTML = F.dates[i] +
                        "<br><b>" + inr(F.point[i]) + "</b> (≈ " + kg(F.point[i]) + "/kg)" +
                        "<br>Expected " + inr(F.point[i] * (1 - err)) + " – " + inr(F.point[i] * (1 + err));
                    tip.style.left = (el.getBoundingClientRect().left - box.getBoundingClientRect().left + box.scrollLeft + 10) + "px";
                    tip.style.top = (el.getBoundingClientRect().top - box.getBoundingClientRect().top - 10) + "px";
                });
                el.addEventListener("mouseleave", function() { tip.style.display = "none"; });
            });

            $("phNote").textContent =
                "Forecast window " + F.dates[0] + " → " + F.dates[n - 1] +
                " (built from history up to " + D.history_end + "). " +
                "Shaded band = model 80% interval. Error width uses test MAPE (" + m.tm.toFixed(1) + "%).";

            var rows = F.dates.map(function(d, i) {
                return "<tr><td>" + d + "</td><td>" + inr(F.point[i]) + "</td>" +
                    "<td>" + inr(F.point[i] * (1 - err)) + " – " + inr(F.point[i] * (1 + err)) + "</td>" +
                    "<td>₹" + (F.point[i] / 100).toFixed(2) + "</td></tr>";
            }).join("");

            $("phTableWrap").innerHTML =
                '<div class="ph-tbl ds-table-box"><table class="ds-table">' +
                '<thead><tr><th>Date</th><th>Predicted (₹/Qtl)</th><th>Expected range (₹/Qtl)</th><th>₹/kg</th></tr></thead>' +
                '<tbody>' + rows + '</tbody></table></div>' +
                '<p style="margin-top:1rem"><button class="eda-filter" id="phCsv" type="button">⬇ Download CSV</button></p>';

            $("phCsv").onclick = function() {
                var t = "date,predicted_price,expected_low,expected_high,p10,p90\n" +
                    F.dates.map(function(d, i) {
                        return [d, F.point[i].toFixed(2),
                            (F.point[i] * (1 - err)).toFixed(2),
                            (F.point[i] * (1 + err)).toFixed(2),
                            F.p10[i].toFixed(2), F.p90[i].toFixed(2)
                        ].join(",");
                    }).join("\n");
                var a = document.createElement("a");
                a.href = URL.createObjectURL(new Blob([t], { type: "text/csv" }));
                a.download = "forecast_" + c + "_" + k + ".csv";
                a.click();
            };
        } else {
            $("phHero").innerHTML = heroCard(m.lo * (1 - err), m.hi * (1 + err), err * 100,
                "Model’s predicted range " + inr(m.lo) + " – " + inr(m.hi));
            $("phKpi").innerHTML =
                kpi(inr(m.lo), "Model low (30-day)") +
                '<div class="esum-div"></div>' +
                kpi(inr(m.hi), "Model high (30-day)") +
                '<div class="esum-div"></div>' +
                kpi("±" + (err * 100).toFixed(0) + "%", "Test MAPE error");
            $("phChart").style.display = "";
            $("phChart").innerHTML = rangeBar(m, err);
            $("phTableWrap").innerHTML = "";
            $("phNote").textContent =
                "";
        }
    }

    $("phGo").addEventListener("click", run);
    $("phCity").addEventListener("change", run);
    $("phCrop").addEventListener("change", run);
    run();
})();