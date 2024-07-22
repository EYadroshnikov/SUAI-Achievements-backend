import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { AchievementOperation } from './entities/achievement-operation.entity';

const OperationPaginateConfig: PaginateConfig<AchievementOperation> = {
  sortableColumns: ['createdAt'],
  filterableColumns: {
    'student.(institute.(id))': [FilterOperator.EQ],
    executor: [FilterOperator.EQ, FilterOperator.IN],
    type: [FilterOperator.EQ, FilterOperator.IN],
    student: [FilterOperator.EQ, FilterOperator.IN],
    achievement: [FilterOperator.EQ, FilterOperator.IN],
  },
  defaultSortBy: [['createdAt', 'DESC']],
};
export default OperationPaginateConfig;
