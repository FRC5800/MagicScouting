<script>
    import { _ } from "svelte-i18n";
    import { App } from '@capacitor/app';
    import { goto } from '$app/navigation';

    App.addListener("backButton", ()=>{goto('/')});
</script>
<div class="w-full text-justify">
  <p>{$_('about.paragraph_1')}</p>
</div>
<h1 class="my-3 text-3xl">{$_('about.purpose_title')}</h1>
<div class="w-full text-justify">
  <p>{$_('about.paragraph_2')}</p>
</div>
<h1 class="my-3 text-3xl">{$_('about.creators.title')}</h1>
<div class="flex items-start w-full flox-col">
  <ul class="list-disc list-outside">
    <li>{$_('about.creators.creator_1')}</li>
    <li>{$_('about.creators.creator_2')}</li>
    <li>{$_('about.creators.creator_3')}</li>
    <li>{$_('about.creators.creator_4')}</li>
  </ul>
</div>
<h1 class="my-3 text-3xl">{$_('about.contribution_title')}</h1>
<div class="w-full text-justify">
  <p>{$_('about.paragraph_3')}</p>
</div>
<div class="w-full text-center">
  <a href="https://www.vakinha.com.br/4450145" class="text-blue-600 underline">{$_('about.fundraise_link')}</a>
</div>