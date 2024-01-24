<script>


    export let isDataBaseSetted = false;
    export let showMenu = false;
</script>

<h1 class="text-2xl">Aviso</h1>
    <div class="separator w-[50%] m-0 mb-4"></div>
    <div class="w-[50vw] flex flex-col items-center">
        <p class="text-base text-justify font-bold dark:text-gray-400 text-gray-600">Antes de usar o aplicativo, adicione o banco de dados que será usado para armazenar as partidas na aba de Menu. Caso tenha alguma dúvida, acesse o nosso README no repositório do projeto:</p>
        <a href="https://github.com/FRC5800/MagicScouting" class="m-4 text-primary-base underline">Repositório</a>
    </div>
    <button on:click={() => {isDataBaseSetted = 'setting'; showMenu = true}} class="mb-10 mt-4 bg-buttons p-2 rounded-lg w-[80%] btn">Ir para menu</button>