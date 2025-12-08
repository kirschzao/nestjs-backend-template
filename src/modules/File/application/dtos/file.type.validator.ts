import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'fileType', async: false })
export class FileTypeValidator implements ValidatorConstraintInterface {
  validate(file, args: ValidationArguments) {
    if (!file) {
      return true;
    }

    if (!file.mimetype) {
      return false;
    }
    const allowedTypes = args.constraints;

    return allowedTypes.includes(file.mimetype);
  }

  defaultMessage(args: ValidationArguments) {
    const allowedExtensions = args.constraints.map((type) => {
      const parts = type.split('/');
      const subType = parts[1];
      if (subType.includes('document')) return 'docx';
      if (subType.includes('sheet')) return 'xlsx';
      return subType as string;
    });
    return `Tipo de arquivo inválido. Tipos permitidos: ${allowedExtensions.join(', ')}.`;
  }
}
