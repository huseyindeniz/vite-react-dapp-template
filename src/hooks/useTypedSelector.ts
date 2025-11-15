import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from '@/core/features/app/store/store';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
