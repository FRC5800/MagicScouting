<script>
    export let scale = 1;
    export let trashColor1 = '#95afc0';
    export let trashColor2 = '#535c68';
    export let trashColor3 = '#dff9fb';
    export let transition = 'all 0.2s ease-in-out';
</script>
<div tabindex="0" role="button" class="trash-box" on:keydown on:click style="--scale: {100*scale}%; --trashColor1: {trashColor1}; --trashColor2: {trashColor2}; --trashColor3: {trashColor3}; --transition: {transition};">
    <div class="trash"></div>
    <div class="trash-top"></div>
    <div class="trash-btm">
        <div class="trash-lines">
            <div class="trash-line"></div>
            <div class="trash-line"></div>
        </div>
    </div>
</div>

<style>
    

 .trash-box {
	 width: 50px;
	 height: 50px;
	 position: relative;
     transform: scale(var(--scale));
}
 .trash-box:hover .trash-top {
	 transform: translate(-50%, -15%) rotate(-20deg);
}
 .trash-box:hover .trash-btm {
	 transform: translate(-50%, -100%) rotate(5deg);
}
 .trash-box:hover .trash {
	 top: 50%;
	 transform: translate(-35%, -50%) rotate(35deg);
}
 .trash-box .trash-top {
	 position: absolute;
	 top: 15%;
	 left: 50%;
	 transform: translate(-50%, -15%);
	 width: 80%;
	 height: 15%;
	 background: var(--trashColor1);
	 border-radius: 5px;
	 transform-origin: left bottom;
	 transition: var(--transition);
}
 .trash-box .trash-top::before {
	 content: "";
	 position: absolute;
	 bottom: 95%;
	 left: 50%;
	 transform: translate(-50%);
	 width: 30%;
	 height: 80%;
	 background: inherit;
	 border-radius: 5px 5px 0 0;
}
 .trash-box .trash-btm {
	 position: absolute;
	 top: 100%;
	 left: 50%;
	 transform: translate(-50%, -100%);
	 width: 70%;
	 height: 65%;
	 background: var(--trashColor1);
	 border-radius: 5px;
	 transform-origin: left 70%;
	 transition: var(--transition);
}
 .trash-box .trash-btm .trash-lines {
	 position: absolute;
	 top: 50%;
	 left: 50%;
	 transform: translate(-50%, -50%);
	 width: 60%;
	 height: 80%;
	 display: flex;
	 justify-content: space-around;
}
 .trash-box .trash-btm .trash-lines .trash-line {
	 width: 20%;
	 height: 100%;
	 background: #7597ad;
	 border-radius: 3px;
}
 .trash-box .trash {
	 position: absolute;
	 top: 80%;
	 left: 38%;
	 transform: translate(-38%, -80%) rotate(35deg);
	 width: 40%;
	 height: 40%;
	 background: var(--trashColor3);
	 border-radius: 2px;
	 transition: var(--transition);
}
 .trash-box .trash::before {
	 content: "";
	 position: absolute;
	 transform: translate(30%, -20%) rotate(25deg);
	 width: 100%;
	 height: 100%;
	 background: #b2f1f5;
	 border-radius: 2px;
}
 
</style>