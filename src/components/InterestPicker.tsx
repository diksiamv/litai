'use client';

interface Option {
  value: string;
  label: string;
}

interface InterestPickerProps {
  title: string;
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  maxSelect?: number;
}

export default function InterestPicker({
  title,
  options,
  selected,
  onChange,
  maxSelect = 5,
}: InterestPickerProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else if (selected.length < maxSelect) {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="font-playfair text-lg text-gold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={`px-4 py-2 rounded-full text-sm border transition-all ${
                isSelected
                  ? 'bg-gold/30 border-gold text-gold font-medium'
                  : 'bg-transparent border-cream/20 text-cream/70 hover:border-gold/40 hover:text-cream'
              }`}
            >
              {isSelected && <span className="mr-1">✓</span>}
              {opt.label}
            </button>
          );
        })}
      </div>
      {selected.length >= maxSelect && (
        <p className="text-xs text-cream/40 mt-2">Максимум {maxSelect} вариантов выбрано</p>
      )}
    </div>
  );
}
