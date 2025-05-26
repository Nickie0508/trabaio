const form = document.getElementById('formulario');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const senha = document.getElementById('senha').value;

  if (senha.length < 6) {
    alert('A senha precisa ter pelo menos 6 caracteres!');
    return;
  }

  mensagem.style.display = 'block';
  form.reset();
});
