import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  ariaLabel?: string;
}

export default function Breadcrumbs({ items, className = 'breadcrumbs', ariaLabel = 'Breadcrumb' }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className={className} aria-label={ariaLabel}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index}>
            {item.href && !isLast ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'current' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="sep">/</span>}
          </span>
        );
      })}
    </nav>
  );
}

