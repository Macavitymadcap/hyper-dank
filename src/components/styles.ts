import { buttonStyles } from "./atoms/Button/Button.styles";
import { cardStyles } from "./atoms/Card/Card.styles";
import { switchStyles } from "./atoms/Switch/Switch.styles";
import { walksCellStyles } from "./atoms/WalksCell/WalksCell.styles";
import { inputGroupStyles } from "./molecules/InputGroup/InputGroup.styles";
import { scrollableTableStyles } from "./molecules/ScrollableTable/ScrollableTable.styles";
import { statStyles } from "./molecules/Stat/Stat.styles";
import { walksRowStyles } from "./molecules/WalksRow/WalksRow.styles";
import { statsStyles } from "./organisms/Stats/Stats.styles";
import { walkFormStyles } from "./organisms/WalkForm/WalkForm.styles";
import { walksTableStyles } from "./organisms/WalksTable/WalksTable.styles";
import { homeStyles } from "./pages/Home/Home.styles";
import { layoutStyles } from "./templates/Layout/Layout.styles";

export const appStyles = [
  layoutStyles,
  buttonStyles,
  cardStyles,
  switchStyles,
  walksCellStyles,
  inputGroupStyles,
  scrollableTableStyles,
  statStyles,
  walksRowStyles,
  statsStyles,
  walkFormStyles,
  walksTableStyles,
  homeStyles,
].join("\n");
