/**
 * @fileOverview styledUnderlinedText component
 * @abstract styledUnderlinedText component is used to underline the text
 * @author Jason
 * @version 1.0.0
 */
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const UnderLinedText = styled(Typography)({
  textDecoration: 'underline',
});

export default UnderLinedText;
