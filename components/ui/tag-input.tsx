'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface TagInputProps {
  /** Current list of tags */
  value: string[];
  /** Called when tags change */
  onChange: (tags: string[]) => void;
  /** Placeholder text when no tags and input is empty */
  placeholder?: string;
  /** Optional predefined suggestions shown as a dropdown */
  suggestions?: { value: string; label: string }[];
  /** Allow free-text tags (not just suggestions) */
  allowCustom?: boolean;
  /** Additional CSS classes for the outer container */
  className?: string;
  /** Disable the input */
  disabled?: boolean;
}

/**
 * A tag / chip input component.
 * - Type and press Enter or comma to add a tag
 * - Click X to remove a tag
 * - Optional dropdown suggestions with type-ahead filtering
 */
export function TagInput({
  value,
  onChange,
  placeholder = 'Add a tag…',
  suggestions = [],
  allowCustom = true,
  className,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    // Prevent duplicates (case-insensitive)
    if (value.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;
    onChange([...value, trimmed]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        // If we have suggestions and custom is not allowed, check the suggestion list
        if (!allowCustom && suggestions.length > 0) {
          const match = suggestions.find(
            (s) => s.label.toLowerCase() === inputValue.trim().toLowerCase()
          );
          if (match) addTag(match.label);
        } else {
          addTag(inputValue);
        }
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.label.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.some((t) => t.toLowerCase() === s.label.toLowerCase())
  );

  // Close suggestions when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        className={cn(
          'flex flex-wrap items-center gap-1.5 min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background transition-colors',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, i) => (
          <Badge
            key={`${tag}-${i}`}
            variant="secondary"
            className="gap-1 pr-1 text-xs font-medium"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(i);
                }}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground text-sm py-1"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-input bg-popover py-1 shadow-md">
          {filteredSuggestions.map((s) => (
            <button
              key={s.value}
              type="button"
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur before click registers
                addTag(s.label);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Helper text */}
      {!disabled && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          Press <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">Enter</kbd> or{' '}
          <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">,</kbd> to add
          {suggestions.length > 0 && '. Choose from suggestions or type your own'}
        </p>
      )}
    </div>
  );
}
