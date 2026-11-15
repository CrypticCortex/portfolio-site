// Section kicker: plate number and what the plate shows.
export default function Kicker({ n, children }) {
  return <p className="kicker"><span>{n}</span>{children}</p>;
}
