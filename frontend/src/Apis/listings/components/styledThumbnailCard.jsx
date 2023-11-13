import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';

const ThumbnailCard = styled(Card)({
  maxWidth: 345,
  position: 'relative',
  borderRadius: '10px', // This will give you rounded corners
  m: 'auto',
  userSelect: 'none',
  // cursor: 'pointer',
});

export default ThumbnailCard;
