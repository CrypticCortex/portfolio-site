// Section kicker: feed number and what the feed shows, in the HUD's voice.
export default function Kicker({ n, children }) {
  return <p className="kicker"><span>FEED {n}</span>{children}</p>;
}
