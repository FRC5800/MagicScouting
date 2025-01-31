<script>
    import { _ } from "svelte-i18n";
    import { goto } from '$app/navigation';
    import teamImage from'$lib/assets/frc1156.png';
    
    // import '@fortawesome/fontawesome-free/css/all.min.css';

</script>

<main class="w-full flex flex-col justify-center items-center bg-[#EAEAEC] dark:bg-primary-heavy dark:text-white">
    <div class="w-full flex grow gap-4 px-6 mt-6 mb-6 flex-col items-start">
      <h1 class="text-2xl font-medium tracking-wide">My Storage</h1>
      <div class="w-full flex flex-row gap-2">
        <button class="py-2 px-4 text-sm w-fit rounded-md box-border border-2 text-[#3da5ff] border-[#3da5ff]">
          All
        </button>
        <button class="py-2 px-4 bolas2 text-sm w-fit rounded-md text-[#3da5ff] font-medium">
          Not Sent
        </button>
        <button class="py-2 px-4 bolas2 text-sm w-fit rounded-md text-[#3da5ff] font-medium">
          Sent
        </button>
      </div>        
    </div>

    <div class="w-full flex grow gap-4 px-6 mb-6 flex-col items-start">
      <h2 class="text-xl font-medium tracking-wide">Sent</h2>
      <div class="bg-[#282828] w-full rounded-md relative p-4 my-2">
        <div class="absolute -left-4 -top-4 rounded-full w-fit h-fit p-1 bg-[#121212] border-[#121212]">
          <img width="45px" height="45px" src={teamImage} alt="">
        </div>
        <details class="dropdown absolute right-4 top-0 dropdown-end">
          <summary class="btn m-1 p-0 bg-[#282828] border-[#282828]"><i class="fi fi-br-menu-dots-vertical text-lg"></i></summary>
          <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>Edit</li>
            <li>Delete</li>
          </ul>
        </details>
        <h3 class="ml-10 text-lg">Team 1156 - Under Control</h3>
        <div class="flex flex-col gap-2 mt-2 justify-center items-center">
          <div class="flex flex-row gap-2">
            <span>Match: 32</span>
            <span>Position: 2</span>
          </div>
          <div class="flex flex-row w-full gap-6">
            <button class="btn grow">Visualize</button>
            <button class="btn btn-circle">
              <i class="fi fi-rr-progress-upload text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="bg-[#282828] w-full rounded-md relative p-4 my-2">
        <div class="absolute -left-4 -top-4 rounded-full w-fit h-fit p-1 bg-[#121212] border-[#121212]">
          <img width="45px" height="45px" src={teamImage} alt="">
        </div>
        <details class="dropdown absolute right-4 top-0 dropdown-end">
          <summary class="btn m-1 p-0 bg-[#282828] border-[#282828]"><i class="fi fi-br-menu-dots-vertical text-lg"></i></summary>
          <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>Edit</li>
            <li>Delete</li>
          </ul>
        </details>
        <h3 class="ml-10 text-lg">Team 1156 - Under Control</h3>
        <div class="flex flex-col gap-2 mt-2 justify-center items-center">
          <div class="flex flex-row gap-2">
            <span>Match: 32</span>
            <span>Position: 2</span>
          </div>
          <div class="flex flex-row w-full gap-6">
            <button class="btn grow">Visualize</button>
            <button class="btn btn-circle">
              <i class="fi fi-rr-progress-upload text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
      <div>
        
      </div>
    </div>

    <div class="w-full flex grow gap-4 px-6 mb-6 flex-col items-start">
      <h2 class="text-xl font-medium tracking-wide">Not Sent</h2>
      <div class="bg-[#282828] w-full rounded-md relative p-4 my-2">
        <div class="absolute -left-4 -top-4 rounded-full w-fit h-fit p-1 bg-[#121212] border-[#121212]">
          <img width="45px" height="45px" src={teamImage} alt="">
        </div>
        <details class="dropdown absolute right-4 top-0 dropdown-end">
          <summary class="btn m-1 p-0 bg-[#282828] border-[#282828]"><i class="fi fi-br-menu-dots-vertical text-lg"></i></summary>
          <ul class="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li>Delete</li>
          </ul>
        </details>
        <h3 class="ml-10 text-lg">Team 1156 - Under Control</h3>
        <div class="flex flex-col gap-2 mt-2 justify-center items-center">
          <div class="flex flex-row gap-2">
            <span>Match: 32</span>
            <span>Position: 2</span>
          </div>
          <div class="flex flex-row w-full gap-6">
            <button class="btn grow">Visualize</button>
            <button class="btn btn-circle btn-disabled">
              <i class="fi fi-rs-check-circle text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
<!-- 
    <div class="bolas w-full h-screen rounded-badge pt-3 px-3">
        <slot />
    </div> -->
</main>

<div class="btm-nav">
    <button on:click={()=>{goto('/')}}>
      <i class="fi fi-rr-home"></i>
    </button>
    <button class="active">
      <i class="fi fi-rr-database"></i>
    </button>
    <button>
      <i class="fi fi-rr-camera"></i>
    </button>
    <button>
      <i class="fi fi-rr-chart-histogram"></i>
    </button>
    <button>
      <i class="fi fi-rr-settings-sliders"></i>
    </button>
  </div>

<style>
    i::before{
    display: block;
  }
  .bolas{
    background: rgba(255, 255, 255, 0.1); /* Light grayish overlay */
    backdrop-filter: blur(8px);
  }
  .bolas2{
    background-color: rgba(24, 147, 255, 0.3);
  }
  h1{
    font-family: "Outfit";
    font-weight: 600;
    color: #E0E0E0;
  }
  h2{
    font-family: "Outfit";
    font-weight: 600;
    color: #E0E0E0;
  }
</style>