import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from '@/features/app/store/store';

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useTypedSelector;
