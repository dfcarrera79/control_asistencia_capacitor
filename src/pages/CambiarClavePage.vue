<template>
  <div class="update-password">
    <h4
      class="row text-uppercase text-primary justify-center content-center"
      style="font-family: 'Bebas Neue'"
    >
      <q-img
        src="../assets/loxasoluciones.png"
        alt="loxasoluciones"
        width="70%"
      />
      Actualizar constraseña
    </h4>
    <form @submit="changePassword(ruc)">
      <div class="form-group">
        <label for="newPassword">Nueva contraseña</label>
        <input
          id="newPassword"
          type="password"
          v-model="newPassword"
          required
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmar contraseña</label>
        <input
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          required
        />
      </div>
      <button type="submit">Cambiar contraseña</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAxios } from '../services/useAxios';
import { useMensajes } from '../services/useMensajes';
import { useRouter } from 'vue-router';

const { put } = useAxios();
const newPassword = ref('');
const confirmPassword = ref('');
const { mostrarMensaje } = useMensajes();
const claveActualizada = ref({
  ruc: '',
  clave: '',
});
const route = useRoute();
const ruc = route.params.ruc;
const router = useRouter();

const changePassword = async (ruc: string) => {
  // Perform password validation
  claveActualizada.value = {
    ruc: ruc,
    clave: newPassword.value,
  };
  if (newPassword.value === confirmPassword.value) {
    await put(
      '/cambiar_clave',
      {},
      JSON.parse(JSON.stringify(claveActualizada.value))
    );
    // Navigate to the login path
    router.push('/login');
  } else {
    mostrarMensaje('Error', 'Las contraseñas no coinciden');
  }
};
</script>

<style scoped>
.update-password {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
}

input[type='password'] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
}

button[type='submit'] {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
