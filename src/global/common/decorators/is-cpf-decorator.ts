import { registerDecorator, ValidationOptions } from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          return cpf.isValid(value);
        },
        defaultMessage() {
          return 'CPF inválido';
        },
      },
    });
  };
}

export function formatCPF(cpfValue: string): string {
  const cleanCPF = cpfValue.replace(/\D/g, '');

  if (cleanCPF.length === 11 && !cpfValue.includes('.')) {
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  return cpfValue;
}
