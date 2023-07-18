<template>
  <q-page class="flex flex-center bg-blue-grey-1">
    <q-dialog v-model="mostrarVentana" persistent>
      <q-card>
        <div class="row bg-blue-grey-8 justify-center q-pa-xs">
          <span class="text-subtitle2 text-center text-white"
            >Cambiar clave de acceso</span
          >
        </div>
        <q-card-section>
          <q-input
            v-model="ruc"
            debounce="750"
            label="RUC | CI | Pasaporte"
            dense
            :rules="rucRule"
            @input="fetchEmail"
          />
          <q-input
            v-model="correoElectronico"
            debounce="750"
            label="Email"
            dense
            :rules="emailRule"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="Enviar"
            @click="enviarCorreoRecuperacion()"
          />
          <q-btn flat label="Cerrar" @click="mostrarVentana = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-card class="shadow-8 bg-white" style="width: 300px; height: 260px">
      <div class="row bg-blue-grey-8 justify-center q-pa-xs">
        <span class="text-subtitle2 text-center text-white"
          >PORTAL DE CONTROL DE ASISTENCIA V0.1</span
        >
      </div>
      <div class="row">
        <div class="column col-xs-12 q-pa-sm">
          <q-input v-model="id" type="text" label="Usuario" dense />
        </div>
        <div class="column col-xs-12 q-pa-sm">
          <q-input
            v-model="clave"
            dense
            :type="isPwd ? 'password' : 'text'"
            label="Clave de acceso"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
      </div>
      <q-separator dark />
      <div class="row">
        <div class="column col-xs-12 q-pa-sm">
          <q-btn
            class="full-width text-white"
            style="height: 40px"
            color="blue"
            label="Ingresar"
            @click="logearse()"
          />
        </div>
      </div>

      <div class="row">
        <div class="column col-xs-12 q-pa-sm">
          <a
            class="full-width text-secondary q-link"
            style="
              display: block;
              height: 40px;
              line-height: 40px;
              text-align: center;
            "
            @click="recuperarContraseña()"
          >
            <span class="hover-primary text-bold"
              >¿OLVIDASTE TU CONTRASEÑA?</span
            >
          </a>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useAxios } from '../services/useAxios';
import { useMensajes } from '../services/useMensajes';
import { LocalStorage, Loading, QSpinnerFacebook } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();
const { get, put } = useAxios();
const { mostrarMensaje } = useMensajes();
const url = ref(authStore.url);
const newUrl = ref(url.value.slice(url.value.indexOf('#') + 1));
const mostrarVentana = ref(false);
const correoElectronico = ref('');
const ruc = ref('');
const id = ref('');
const clave = ref('');
const isPwd = ref(true);

const rucRule: ((v: string) => string | boolean)[] = [
  (v: string) => !!v || 'El RUC es obligatorio',
  (v: string) => /^\d{13}$/.test(v) || 'El RUC debe contener 13 dígitos',
];

const emailRule: ((v: string) => string | boolean)[] = [
  (v: string) => !!v || 'El correo electrónico es obligatorio',
  (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
    'Formato de correo electrónico inválido',
];

onMounted(() => {
  const session = LocalStorage.getItem('session');

  if (session) {
    authStore.iniciarSesion(session.token);
    router.push(newUrl.value);
  }
});

const logearse = async () => {
  if (id.value.trim().length === 0) {
    mostrarMensaje(
      'Error',
      'Es necesario ingresar su número de RUC o identificación'
    );
    return;
  }
  if (clave.value.trim().length === 0) {
    mostrarMensaje('Error', 'Es obligatorio ingresar su clave de acceso');
    return;
  }
  Loading.show({
    spinner: QSpinnerFacebook,
    message: 'Verificando acceso...',
  });
  const respuesta = await get('/validar_usuario', {
    id: id.value,
    clave: clave.value,
  });
  Loading.hide();
  if (respuesta.error === 'S') {
    mostrarMensaje('Error', respuesta.mensaje);
    return;
  }
  authStore.iniciarSesion(respuesta.token);
  router.push('/');
};

const recuperarContraseña = () => {
  mostrarVentana.value = true;
};

async function fetchEmail() {
  try {
    const respuesta = await get('/obtener_usuario', {
      id: ruc.value,
    });

    // Assuming the response data has a property 'email' containing the email address
    correoElectronico.value = respuesta.objetos;
    console.log('Is running');
  } catch (error) {
    console.error('Error fetching email:', error);
    console.log('Is not running');
  }
}

watch(ruc, fetchEmail);

const enviarCorreoRecuperacion = async () => {
  try {
    const response = await put(
      '/resetear_clave_acceso',
      {},
      JSON.parse(
        JSON.stringify({
          email: correoElectronico.value,
          ruc: ruc.value,
        })
      )
    );

    // Handle the response accordingly
    console.log(response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
</script>

<style>
.hover-primary:hover {
  color: #1976d2;
}
</style>
