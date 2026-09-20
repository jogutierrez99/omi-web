"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import {
  countryCallingCodes,
  getCountryCallingCodeId,
  type CountryCallingCodeId,
} from "@/src/data/country-calling-codes";

interface CountryCallingCodeSelectProps {
  value: CountryCallingCodeId;
  onChange: (value: CountryCallingCodeId) => void;
  disabled?: boolean;
}

export function CountryCallingCodeSelect({ value, onChange, disabled = false }: CountryCallingCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = countryCallingCodes.findIndex((country) => getCountryCallingCodeId(country) === value);
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const listboxId = `${id}-listbox`;
  const selectedCountry = countryCallingCodes[Math.max(selectedIndex, 0)];

  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.getElementById(`${id}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, id, isOpen]);

  useEffect(() => () => {
    if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
  }, []);

  function selectCountry(index: number) {
    onChange(getCountryCallingCodeId(countryCallingCodes[index]));
    setIsOpen(false);
  }

  function findByTypeahead(character: string) {
    const normalizedCharacter = character.toLocaleLowerCase("es");
    const previousQuery = typeaheadRef.current;
    const isRepeatedInitial = previousQuery.length > 0 && [...previousQuery].every((value) => value === normalizedCharacter);
    typeaheadRef.current = `${previousQuery}${normalizedCharacter}`;
    if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
    typeaheadTimerRef.current = setTimeout(() => { typeaheadRef.current = ""; }, 700);
    const query = isRepeatedInitial ? normalizedCharacter : typeaheadRef.current;
    for (let offset = 1; offset <= countryCallingCodes.length; offset += 1) {
      const index = (activeIndex + offset) % countryCallingCodes.length;
      if (countryCallingCodes[index].name.toLocaleLowerCase("es").startsWith(query)) {
        setActiveIndex(index);
        break;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === "Tab") {
      setIsOpen(false);
      return;
    }
    if (event.key === "Escape") {
      if (isOpen) event.preventDefault();
      setIsOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setActiveIndex(Math.max(selectedIndex, 0));
        setIsOpen(true);
        return;
      }
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + direction + countryCallingCodes.length) % countryCallingCodes.length);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(event.key === "Home" ? 0 : countryCallingCodes.length - 1);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) selectCountry(activeIndex);
      else {
        setActiveIndex(Math.max(selectedIndex, 0));
        setIsOpen(true);
      }
      return;
    }
    if (event.key.length === 1 && /\S/u.test(event.key)) {
      findByTypeahead(event.key);
      if (!isOpen) setIsOpen(true);
    }
  }

  return (
    <div ref={wrapperRef} className="relative mt-2 min-w-0">
      <button
        type="button"
        id="phoneCountryCode"
        role="combobox"
        aria-label={`País y prefijo telefónico: ${selectedCountry.name} (${selectedCountry.callingCode})`}
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => {
          if (!isOpen) setActiveIndex(Math.max(selectedIndex, 0));
          setIsOpen((current) => !current);
        }}
        onKeyDown={handleKeyDown}
        className="flex min-h-12 w-full min-w-0 items-center gap-2 rounded-2xl border border-blue-100 bg-white px-3 text-[#061643] outline-none transition hover:border-blue-300 focus:border-[#0873ce] focus:ring-3 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
      >
        <span className={`fi fi-${selectedCountry.iso2.toLowerCase()} shrink-0 rounded-sm`} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-left font-medium">{selectedCountry.callingCode}</span>
        <span className="text-xs text-slate-500" aria-hidden="true">▾</span>
      </button>

      {isOpen && (
        <ul id={listboxId} role="listbox" aria-label="Países y prefijos telefónicos" className="absolute left-0 top-[calc(100%+.5rem)] z-40 max-h-72 w-[min(22rem,calc(100vw-3rem))] overflow-y-auto rounded-2xl border border-blue-100 bg-white p-1.5 shadow-xl">
          {countryCallingCodes.map((country, index) => (
            <li
              key={getCountryCallingCodeId(country)}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={getCountryCallingCodeId(country) === value}
              onMouseEnter={() => setActiveIndex(index)}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => selectCountry(index)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${index === activeIndex ? "bg-blue-50 text-[#061643] forced-colors:outline forced-colors:outline-2 forced-colors:outline-[Highlight]" : "text-slate-700"}`}
            >
              <span className={`fi fi-${country.iso2.toLowerCase()} shrink-0 rounded-sm`} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{country.name}</span>
              <span className="shrink-0 font-semibold text-[#0873ce]">{country.callingCode}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
