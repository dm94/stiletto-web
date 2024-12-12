import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Ingredients from "../Ingredients";
import Icon from "../Icon";
import CraftingTime from "../CraftingTime";
import Station from "../Station";
import { getDomain } from "../../functions/utils";

const SelectedItem = ({ item, onChangeCount }) => {
  const [disableEdit, setDisableEdit] = useState(true);
  const { t } = useTranslation();

  const showIngredient = () => {
    if (!item?.crafting) {
      return false;
    }

    return item.crafting.map((ingredients, i) => (
      <div
        className={
          item.crafting.length > 1
            ? "col-xl-6 border border-success"
            : "col-xl-12"
        }
        key={`${item.name}-${item.count}-${i}`}
      >
        <Ingredients
          crafting={ingredients}
          value={
            ingredients.output != null
              ? item.count / ingredients.output
              : item.count
          }
        />
        {ingredients.station && <Station name={ingredients.station} />}
        {ingredients.time && (
          <CraftingTime time={ingredients.time} total={item.count} />
        )}
      </div>
    ));
  };

  const showDamage = () => {
    if (!item?.damage) {
      return false;
    }

    return (
      <div className="col-12 text-muted">
        <div className="row">
          <div className="col-12">{t("Damage")}</div>
          <div className="col">100% = {item.damage * item.count}</div>
          <div className="col">50% = {item.damage * item.count * 0.5}</div>
          <div className="col">30% = {item.damage * item.count * 0.3}</div>
          <div className="col">10% = {item.damage * item.count * 0.1}</div>
        </div>
      </div>
    );
  };

  const handleChange = (count) => {
    onChangeCount(item.name, Number.parseInt(item.count) + count);
  };

  const url = `${getDomain()}/item/${encodeURI(
    item.name.replaceAll(" ", "_")
  )}`;

  return (
    <div className="col-xl-6 col-sm-12">
      <div className="card">
        <div className="text-center card-header">
          <button
            type="button"
            className="close"
            aria-label="Remove item"
            onClick={() => onChangeCount(item.name, 0)}
          >
            <span aria-hidden="true">X</span>
          </button>
          <div className="input-group w-75">
            <input
              type="number"
              className="form-control text-center"
              value={item.count}
              onChange={(e) => onChangeCount(item.name, e.target.value)}
              onMouseEnter={() => setDisableEdit(false)}
              onMouseLeave={() => setDisableEdit(true)}
              min="1"
              max="9999"
              readOnly={disableEdit}
            />
            <span className="input-group-text">
              <Icon key={item.name} name={item.name} />
              <a href={url}>{t(item.name, { ns: "items" })}</a>
            </span>
          </div>
        </div>
        <div className="card-body">
          <div className="list-unstyled row">{showIngredient()}</div>
          {showDamage()}
        </div>
        <div className="card-footer">
          <div className="row">
            <div className="col-4 col-lg-2 p-1">
              <button
                type="button"
                className="btn btn-success btn-block p-2"
                onClick={() => handleChange(1)}
              >
                +1
              </button>
            </div>
            <div className="col-4 col-lg-2 p-1">
              <button
                type="button"
                className="btn btn-success btn-block p-2"
                onClick={() => handleChange(10)}
              >
                +10
              </button>
            </div>
            <div className="col-4 col-lg-2 p-1">
              <button
                type="button"
                className="btn btn-success btn-block p-2"
                onClick={() => handleChange(100)}
              >
                +100
              </button>
            </div>
            <div className="col-4 col-lg-2 p-1">
              <button
                type="button"
                className="btn btn-danger btn-block p-2"
                onClick={() => handleChange(-1)}
              >
                -1
              </button>
            </div>
            <div className="col-4 col-lg-2 p-1">
              <button
                type="button"
                className="btn btn-danger btn-block p-2"
                onClick={() => handleChange(-10)}
              >
                -10
              </button>
            </div>
            <div className="col-4 col-lg-2 p-1">
              <button
                type="button"
                className="btn btn-danger btn-block p-2"
                onClick={() => handleChange(-100)}
              >
                -100
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedItem;
