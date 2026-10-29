import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

function CatalogFilters({ search, category, stockOnly, categories, onSearchChange, onCategoryChange, onStockChange }) {
  return (
    <Form className="filter-bar" onSubmit={(event) => event.preventDefault()}>
      <Row className="g-3 align-items-end w-100">
        <Col xs={12} lg={6}>
          <Form.Label htmlFor="search">Buscar por nombre, marca o código</Form.Label>
          <Form.Control id="search" type="search" value={search} placeholder="Ej.: taladro o HE001" onChange={(event) => onSearchChange(event.target.value)} />
        </Col>
        <Col xs={12} md={7} lg={4}>
          <Form.Label htmlFor="category">Categoría</Form.Label>
          <Form.Select id="category" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </Form.Select>
        </Col>
        <Col xs={12} md={5} lg={2}>
          <Form.Check id="stock-only" type="checkbox" checked={stockOnly} label="Solo con stock" onChange={(event) => onStockChange(event.target.checked)} />
        </Col>
      </Row>
    </Form>
  )
}

export default CatalogFilters
