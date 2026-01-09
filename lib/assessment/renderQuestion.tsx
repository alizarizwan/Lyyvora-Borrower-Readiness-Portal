import { RangeSlider } from "@/components/range-slider";
import { CheckboxField } from "@/components/checkbox-field";

export function renderQuestion(q: any, value: any, onChange: any) {
  switch (q.type) {
    case "currency_number":
      return (
        <input
          type="number"
          value={value ?? ""}
          onChange={e => onChange(Number(e.target.value))}
        />
      );
    case "range":
      return (
        <RangeSlider
          min={q.min ?? 0}
          max={q.max ?? 100}
          step={q.step ?? 1}
          value={value ?? q.min ?? 0}
          onChange={onChange}
        />
      );
    case "dropdown":
      return (
        <select value={value ?? ""} onChange={e => onChange(e.target.value)}>
          <option value="">Select</option>
          {q.options?.map((o: string) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );
    case "multi_select":
      return (
        <div className="space-y-2">
          {q.options?.map((option: string) => (
            <CheckboxField
              key={option}
              label={option}
              checked={(value ?? []).includes(option)}
              onChange={(checked) => {
                const newValue = checked
                  ? [...(value ?? []), option]
                  : (value ?? []).filter((v: string) => v !== option);
                onChange(newValue);
              }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
}
