type LinkProps = {
  href: string;
  name: string;
};

function Link(props: LinkProps) {
  return (
    <a href={props.href}>{props.name}</a>
  );
}

export default Link;