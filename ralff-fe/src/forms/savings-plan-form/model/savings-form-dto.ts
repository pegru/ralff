import {SavingsDto} from './savings-dto';

export interface SavingsFormDto {
  title: string,
  startDate: Date | null,
  endDate: Date | null,
  monthlySavings: number,
  savings: SavingsDto[]
}
