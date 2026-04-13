import PortfolioInterface from "../portfolio-interface";

export const metadata = {
  title: "Slopworld | Matt Ramirez",
  description:
    "Slopworld is Matt Ramirez's newsletter module."
};

export default function WritingPage() {
  return <PortfolioInterface initialModule="writing" />;
}
