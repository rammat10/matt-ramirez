import PortfolioInterface from "../portfolio-interface";

export const metadata = {
  title: "Substack | Matt Ramirez",
  description:
    "Substack is Matt Ramirez's newsletter module."
};

export default function WritingPage() {
  return <PortfolioInterface initialModule="writing" />;
}
