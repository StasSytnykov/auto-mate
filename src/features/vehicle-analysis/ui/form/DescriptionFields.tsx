'use client';

import * as React from 'react';
import { HelpCircle } from 'lucide-react';
import { FormTextarea } from '@/shared/ui/form';

interface DescriptionFieldsProps {
  sellerDescription: string;
  userQuestion: string;
  onSellerDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onUserQuestionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sellerDescriptionError?: string;
  userQuestionError?: string;
  disabled?: boolean;
}

export function DescriptionFields({
  sellerDescription,
  userQuestion,
  onSellerDescriptionChange,
  onUserQuestionChange,
  sellerDescriptionError,
  userQuestionError,
  disabled,
}: DescriptionFieldsProps) {
  return (
    <>
      <FormTextarea
        id="sellerDescription"
        name="sellerDescription"
        label="Опис продавця / Деталі стану"
        value={sellerDescription}
        onChange={onSellerDescriptionChange}
        placeholder="Продавець пише: не бита, замінено масло, є нюанс по крилу..."
        rows={4}
        error={sellerDescriptionError}
        disabled={disabled}
        labelSuffix={<span className="text-slate-500">(скопіюйте опис з оголошення сюди)</span>}
      />
      <FormTextarea
        id="userQuestion"
        name="userQuestion"
        label="Ваше запитання до AI експерта"
        value={userQuestion}
        onChange={onUserQuestionChange}
        placeholder="напр. Чи надійний тут автомат? Чи дорога вона в обслуговуванні?"
        rows={2}
        error={userQuestionError}
        disabled={disabled}
        labelIcon={<HelpCircle className="h-4 w-4 text-blue-400" />}
      />
    </>
  );
}
