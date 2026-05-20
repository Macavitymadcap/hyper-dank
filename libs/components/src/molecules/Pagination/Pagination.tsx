export interface PaginationProps {
  ariaLabel?: string;
  className?: string;
  currentPage: number;
  nextHref?: string;
  previousHref?: string;
  totalPages: number;
}

export const Pagination = ({
  ariaLabel = "Pagination",
  className,
  currentPage,
  nextHref,
  previousHref,
  totalPages,
}: PaginationProps) => {
  const classes = ["pagination", className].filter(Boolean).join(" ");

  return (
    <nav className={classes} aria-label={ariaLabel}>
      {previousHref ? (
        <a href={previousHref} rel="prev">
          Previous
        </a>
      ) : (
        <span aria-disabled="true">Previous</span>
      )}
      <span aria-current="page">
        Page {currentPage} of {totalPages}
      </span>
      {nextHref ? (
        <a href={nextHref} rel="next">
          Next
        </a>
      ) : (
        <span aria-disabled="true">Next</span>
      )}
    </nav>
  );
};
