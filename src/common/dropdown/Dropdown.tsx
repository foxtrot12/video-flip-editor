import { ChangeEventHandler, memo, ReactNode, useMemo } from "react";
import "./dropdown.scss";

interface DropdownParams {
  labelInner: ReactNode;
  value: string | number;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: Array<{ label: string; value: number | string }>;
  id: string;
}

function Dropdown(props: DropdownParams) {
  return (
    <div className="relative dropdown hFull wFull">
      <select
        className="cursorPtr select absolute hFull wFull"
        value={props.value}
        onChange={props.onChange}
        id={props.id}
      >
        {props.options.map(({ value, label }, ind) => (
          <option className="opt" key={ind} value={value}>
            {label}
          </option>
        ))}
      </select>
      <label className="label hFull wFull verHorCenter flex" htmlFor={props.id}>
        {props.labelInner}
      </label>
    </div>
  );
}

export default memo(Dropdown);
