import RangeSlider from "@/components/range-slider";
import CheckboxField from "@/components/checkbox-field";

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
    case "dropdown":
      return (
        <select value={value ?? ""} onChange={e => onChange(e.target.value)}>
          <option value="">Select</option>
          {q.options.map((o: string) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );
    case "multi_select":
      return (
        <CheckboxField
          options={q.options}
          selected={value ?? []}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}
