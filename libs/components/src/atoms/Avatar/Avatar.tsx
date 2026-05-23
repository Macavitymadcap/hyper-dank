export interface AvatarProps {
  className?: string;
  initials?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  src?: string;
}

export const Avatar = ({ className, initials, name, size = "md", src }: AvatarProps) => {
  const classes = ["avatar", className].filter(Boolean).join(" ");
  const fallback = initials ?? initialsFromName(name);

  if (src) {
    return (
      <span className={classes} data-size={size}>
        <img className="avatar-image" src={src} alt={name} />
      </span>
    );
  }

  return (
    <span className={classes} data-size={size} role="img" aria-label={name}>
      <span className="avatar-fallback" aria-hidden="true">
        {fallback}
      </span>
    </span>
  );
};

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
