/**
 * @fileOverview styledThumbnailCard component
 * @abstract styledThumbnailCard component is used to style the thumbnail card
 * @see https://mui.com/components/cards/#customization
 * @author Jason
 * @version 1.0.0
 */
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';

const ThumbnailCard = styled(Card)({
  maxWidth: 345,
  position: 'relative',
  borderRadius: '10px', // This will give rounded corners
  m: 'auto',
  userSelect: 'none',
});

export default ThumbnailCard;
