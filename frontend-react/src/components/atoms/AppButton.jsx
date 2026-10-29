import Button from 'react-bootstrap/Button'

function AppButton({ children, variant = 'success', ...props }) {
  return <Button variant={variant} {...props}>{children}</Button>
}

export default AppButton
