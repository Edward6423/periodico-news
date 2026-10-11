import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AlmacenamientoService } from '../../core/services/almacenamiento.service';

/** Correo con formato usuario@dominio.extensión */
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/** Mensajes de error que se muestran debajo de cada campo. */
const MENSAJES: Record<string, Record<string, string>> = {
  nombre: { required: 'El nombre es obligatorio.', minlength: 'El nombre debe tener al menos 3 caracteres.' },
  correo: { required: 'El correo electrónico es obligatorio.', pattern: 'Ingresa un correo válido, por ejemplo nombre@ejemplo.com.' },
  mensaje: { required: 'El mensaje es obligatorio.', minlength: 'El mensaje debe tener al menos 10 caracteres.' },
};

/**
 * ContactoComponent — formulario reactivo (Reactive Forms) con validaciones:
 * nombre, correo y mensaje obligatorios y correo con formato válido.
 * Si todo es correcto muestra un mensaje de confirmación.
 */
@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.html',
})
export class ContactoComponent {
  private fb = inject(FormBuilder);
  private almacen = inject(AlmacenamientoService);
  private ruta = inject(ActivatedRoute);

  /** Definición del formulario y sus reglas de validación. */
  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.pattern(PATRON_CORREO)]],
    asunto: ['', [Validators.maxLength(100)]],
    mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
  });

  /** Valor del mensaje como señal, para el contador de caracteres. */
  protected readonly textoMensaje = toSignal(this.form.controls.mensaje.valueChanges, { initialValue: '' });

  protected readonly enviado = signal(false);

  constructor() {
    // Si se llega desde el detalle de una noticia, el asunto viene en la URL
    const asunto = this.ruta.snapshot.queryParamMap.get('asunto');
    if (asunto) this.form.controls.asunto.setValue(asunto);
  }

  /** true si el campo tiene error y el usuario ya lo tocó. */
  invalido(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  valido(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.valid && control.touched;
  }

  /** Devuelve el primer mensaje de error del campo. */
  error(campo: 'nombre' | 'correo' | 'mensaje'): string {
    const errores = this.form.controls[campo].errors;
    if (!errores) return '';
    const tipo = Object.keys(errores)[0];
    return MENSAJES[campo][tipo] ?? 'Valor no válido.';
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.enviado.set(false);
      // Lleva el foco al primer campo con error
      setTimeout(() => (document.querySelector('form .is-invalid') as HTMLElement | null)?.focus());
      return;
    }

    // Sin servidor: el mensaje se guarda en sessionStorage
    const enviados = this.almacen.leer<unknown[]>('pn_mensajes', [], true);
    enviados.push({ ...this.form.getRawValue(), fecha: new Date().toISOString() });
    this.almacen.guardar('pn_mensajes', enviados, true);

    this.enviado.set(true);
    this.form.reset();
    setTimeout(() => document.getElementById('confirmacion')?.focus());
  }
}
