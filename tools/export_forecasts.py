# ===== PASTE AS THE LAST CELL of PriceHarvest_Phase3_LeakageFixed.ipynb (after Step 15) and RUN =====
# It downloads forecasts.js  ->  put it in the SAME folder as predict.html  ->  push to GitHub.
# Uses objects your notebook already creates: final_name, future_dict_lgbm/xgb/global,
# future_dict_quantile, common_end.
import json
def _col(df):
    return next(c for c in df.columns if c.startswith("predicted"))

out = {"history_end": str(common_end.date()), "series": {}}
for (city, crop), winner in final_name.items():
    src = {"LGBM": future_dict_lgbm, "XGB": future_dict_xgb, "Global": future_dict_global}[winner][(city, crop)]
    q = future_dict_quantile[(city, crop)]
    out["series"][f"{city}|{crop}"] = {
        "model": winner,
        "dates": [d.strftime("%Y-%m-%d") for d in src["ds"]],
        "point": [round(float(v), 2) for v in src[_col(src)]],
        "p10": [round(float(v), 2) for v in q["p10"]],
        "p50": [round(float(v), 2) for v in q["p50"]],
        "p90": [round(float(v), 2) for v in q["p90"]],
    }

# OPTIONAL: add the last 60 days of REAL prices so the chart shows history + forecast.
# Set hist_df to your cleaned daily table with columns: City, Crop, ds (date), y (Modal price).
# If your column names differ, change them below. Skip this block if unsure.
try:
    for (city, crop) in final_name:
        h = hist_df[(hist_df.City == city) & (hist_df.Crop == crop)].sort_values("ds").tail(60)
        out["series"][f"{city}|{crop}"]["hist"] = {
            "dates": [d.strftime("%Y-%m-%d") for d in h["ds"]],
            "y": [round(float(v), 2) for v in h["y"]],
        }
except NameError:
    print("hist_df not defined -> exporting forecast only (that is fine)")

assert len(out["series"]) == 25, len(out["series"])
with open("forecasts.js", "w") as f:
    f.write("window.PH_FORECASTS = " + json.dumps(out) + ";")
print("forecasts.js written:", len(out["series"]), "series | history ends", out["history_end"])
try:
    from google.colab import files; files.download("forecasts.js")
except Exception:
    pass
