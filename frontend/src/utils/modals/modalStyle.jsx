// Style for the modal, using the system properties for responsiveness
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto', // Adjust width to be auto, so it will not overflow the viewport
  maxWidth: '100%', // Ensure the modal does not exceed the width of the viewport
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto', // Add scroll if content is larger than the modal
  '&:focus-visible': {
    outline: 'none', // Remove focus outline for accessibility
  },
  // Use MUI's breakpoints for responsiveness
  '@media (max-width:600px)': {
    width: '80%', // On small screens, make the modal width 80% of the viewport
    p: 2, // Reduce padding on small screens
  }
};

export default style;
