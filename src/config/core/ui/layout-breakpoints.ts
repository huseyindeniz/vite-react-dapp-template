import { MantineBreakpoint } from '@mantine/core';

/**
 * Centralized breakpoint configuration for layout components
 * Ensures navbar, aside, and header visibility breakpoints stay in sync
 */

interface LayoutBreakpoints {
  /**
   * Single breakpoint where:
   * - Navbar becomes mobile drawer
   * - Aside hides completely
   * - Header shows burger menu
   * - Header hides desktop menu items
   *
   * Change this one value to adjust all layout responsiveness
   */
  MOBILE: MantineBreakpoint;
}

export const LAYOUT_BREAKPOINTS: LayoutBreakpoints = {
  MOBILE: 'xl',
};
