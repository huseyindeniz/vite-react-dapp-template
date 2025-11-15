import React from 'react';

import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { NavLink, useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const location = useLocation();

  if (items.length <= 1) {
    return null;
  }

  return (
    <Breadcrumbs separator="/" mb="md">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        // Remove trailing slash for comparison
        const currentPath = location.pathname.replace(/\/$/, '');
        const itemPath = item.href.replace(/\/$/, '');
        const isCurrentPage = currentPath === itemPath;

        if (isLast && isCurrentPage) {
          return (
            <Text key={item.href} c="dimmed">
              {item.title}
            </Text>
          );
        }

        return (
          <Anchor key={item.href} component={NavLink} to={item.href}>
            {item.title}
          </Anchor>
        );
      })}
    </Breadcrumbs>
  );
};
