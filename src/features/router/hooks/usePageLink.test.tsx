import { usePageLink } from './usePageLink';

describe.skip('usePageLink', () => {
  it('returns the correct path for the default language', () => {
    // Mock useTranslation hook to return the default language
    vi.mock('react-i18next', () => ({
      // this mock makes sure any components using the translate hook can use it without a warning being shown
      useTranslation: () => {
        return {
          t: (str: string) => str,
          i18n: {
            changeLanguage: () => new Promise(() => {}),
          },
          resolvedLanguage: 'en-US',
        };
      },
      initReactI18next: {
        type: '3rdParty',
        init: vi.fn(),
      },
    }));
    //const originalPath = '/test';
    //const { result } = renderHook(() => usePageLink(originalPath));

    //expect(result.current).toBe(originalPath);
  });

  it('returns the correct path for a non-default language', () => {
    // Mock useTranslation hook to return a non-default language
    vi.mock('react-i18next', () => ({
      // this mock makes sure any components using the translate hook can use it without a warning being shown
      useTranslation: () => {
        return {
          t: (str: string) => str,
          i18n: {
            resolvedLanguage: () => 'tr-TR', // not working
          },
        };
      },
    }));

    const originalPath = '/test';
    const { pageLink } = usePageLink();
    const actualLink = pageLink(originalPath);

    expect(actualLink).toBe(`/tr-TR${originalPath}`);
  });
});
