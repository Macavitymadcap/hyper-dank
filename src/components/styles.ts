import { buttonStyles } from "./atoms/Button.styles";
import { switchStyles } from "./atoms/Switch.styles";
import { walksCellStyles } from "./atoms/WalksCell.styles";
import { inputGroupStyles } from "./molecules/InputGroup.styles";
import { statStyles } from "./molecules/Stat.styles";
import { walksRowStyles } from "./molecules/WalksRow.styles";
import { statsStyles } from "./organisms/Stats.styles";
import { walkFormStyles } from "./organisms/WalkForm.styles";
import { walksTableStyles } from "./organisms/WalksTable.styles";
import { homeStyles } from "./pages/Home.styles";
import { layoutStyles } from "./templates/Layout.styles";

export const appStyles = [
  layoutStyles,
  buttonStyles,
  switchStyles,
  walksCellStyles,
  inputGroupStyles,
  statStyles,
  walksRowStyles,
  statsStyles,
  walkFormStyles,
  walksTableStyles,
  homeStyles,
].join("\n");
