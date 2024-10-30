import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModelGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportesService } from '../reportes.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ProductoService } from '../producto.service';

interface Producto {
  id: number;
  nombre: string;
  categoria_id: number;
  categoria_nombre: string;
  proveedor: string;
  total_vendidos?: number;
  precio: number;
  descripcion: string;
  cantidad_vendida: number;

}

interface ReporteGeneralVentas {
  total_ventas: number;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  menuOptions = [
    'Existencia de Productos',
    'Usuarios Inscritos',
    'Productos Vendidos',
    'Mayormente Vendidos',
    'Ventas Generales',
    'Errores de Compras',
    'Empleados por Departamento'
  ];

  selectedReport: string = '';
  categoriaId: number | undefined;
  categorias: any[] = [];
  existenciaForm: FormGroup;
  usuarios: any[] = [];
  productosVendidos: Producto[] = [];
  mayormenteVendidos: Producto[] = [];
  productosExistencia: any[] = [];
  generalVentas: any = {}; 
  totalVendido: number = 0;  // Almacena el total vendido
  erroresCompras: any[] = [];
  empleados: any[] = [];

  constructor(private fb: FormBuilder, private reportesService: ReportesService, private productosService: ProductoService) {
    this.existenciaForm = this.fb.group({
      fecha: ['']
    });
  }


  ngOnInit() {
    this.cargarCategorias();
   //this.getGeneralVentas();
  }

  onMenuChange(report: string) {
    this.selectedReport = report;
    // Resetea los datos de otros reportes si es necesario
    if (report === 'Usuarios Inscritos') {
      this.getUsuariosInscritos();
    } else if (report === 'Mayormente Vendidos') {
      this.getMayormenteVendidos();
    } else if (report === 'Ventas Generales') {
      this.getGeneralVentas();
    } else if (report === 'Errores de Compras') {
      this.getErroresCompras();
    }
  }

  cargarCategorias() {
    this.productosService.MostrarCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }


  getReporteExistencia() {
    const fecha = this.existenciaForm.value.fecha;
    this.reportesService.getExistenciaProductos(fecha).subscribe({
      next: (result) => {
        console.log('Existencia de Productos:', result);
        this.productosExistencia = result;
      },
      error: (error) => {
        console.error('Error al obtener el reporte de existencia:', error);
      }
    });
  }

  getUsuariosInscritos() {
    this.reportesService.getUsuariosInscritos().subscribe({
      next: (result) => {
        this.usuarios = result;
      },
      error: (error) => {
        console.error('Error al obtener los usuarios inscritos:', error);
      }
    });
  }


  onCategoriaChange(categoriaId: string) {
    this.categoriaId = Number(categoriaId); // Convierte el valor a número
  }

  getProductosVendidos(nombre?: string, proveedor?: string) {
    this.reportesService.getProductosVendidos(nombre, this.categoriaId, proveedor).subscribe({
      next: (result) => {
        this.productosVendidos = result;
        console.log('Productos Vendidos:', result);
      },
      error: (error) => {
        console.error('Error al obtener productos vendidos:', error);
      }
    });
  }

  getMayormenteVendidos() {
    this.reportesService.getMayormenteVendidos().subscribe({
      next: (result) => {
        this.mayormenteVendidos = result;
        console.log('Productos Mayormente Vendidos:', result);
      },
      error: (error) => {
        console.error('Error al obtener productos mayormente vendidos:', error);
      }
    });
  }

  getGeneralVentas(): void {
    this.reportesService.getGeneralVentas().subscribe({
      next: (result) => {
        if (result) {
          this.generalVentas = result; // Aquí guardas el objeto completo
          this.totalVendido = result.total_vendido || 0; // Obtienes el total vendido
        }
      },
      error: (error) => {
        console.error('Error al obtener ventas generales:', error);
        this.generalVentas = { ventas: [] }; // Asegurarse de inicializar como objeto vacío con ventas
        this.totalVendido = 0;
      }
    });
  }


  getErroresCompras() {
    this.reportesService.getErroresCompras().subscribe({
      next: (result) => {
        this.erroresCompras = result;
        console.log('Errores de Compras:', result);
      },
      error: (error) => {
        console.error('Error al obtener errores de compras:', error);
      }
    });
  }

  getEmpleadosPorDepartamento(departamento: string) {
    this.reportesService.getEmpleadosPorDepartamento(departamento).subscribe({
      next: (result) => {
        this.empleados = result;
        console.log('Empleados por Departamento:', result);
      },
      error: (error) => {
        console.error('Error al obtener empleados por departamento:', error);
      }
    });
  }
}
