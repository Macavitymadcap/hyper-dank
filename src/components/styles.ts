import { buttonStyles } from "./atoms/Button/Button.styles";
import { cardStyles } from "./atoms/Card/Card.styles";
import { chipStyles } from "./atoms/Chip/Chip.styles";
import { switchStyles } from "./atoms/Switch/Switch.styles";
import { walksCellStyles } from "./atoms/WalksCell/WalksCell.styles";
import { inputGroupStyles } from "./molecules/InputGroup/InputGroup.styles";
import { labelledOutputStyles } from "./molecules/LabelledOutput/LabelledOutput.styles";
import { scrollableTableStyles } from "./molecules/ScrollableTable/ScrollableTable.styles";
import { walksRowStyles } from "./molecules/WalksRow/WalksRow.styles";
import { statsStyles } from "./organisms/Stats/Stats.styles";
import { walkFormStyles } from "./organisms/WalkForm/WalkForm.styles";
import { walksTableStyles } from "./organisms/WalksTable/WalksTable.styles";
import { adminStyles } from "./pages/Admin/Admin.styles";
import { homeStyles } from "./pages/Home/Home.styles";
import { loginStyles } from "./pages/Login/Login.styles";
import { layoutStyles } from "./templates/Layout/Layout.styles";

export const appStyles = [
  layoutStyles,
  buttonStyles,
  cardStyles,
  chipStyles,
  switchStyles,
  walksCellStyles,
  inputGroupStyles,
  labelledOutputStyles,
  scrollableTableStyles,
  walksRowStyles,
  statsStyles,
  walkFormStyles,
  walksTableStyles,
  adminStyles,
  homeStyles,
  loginStyles,
].join("\n");
