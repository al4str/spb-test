const documentReady = () => new Promise((resolve) => {
  document.readyState === 'complete' ?
    resolve() :
    window.addEventListener('load', resolve, true);
});

documentReady().then(() => {
  const $cover = document.getElementById('cover');
  const $switch = document.getElementById('switch');
  const $opacity = document.getElementById('opacity');
  if (!$cover || !$switch || !$opacity || window.Vue === undefined) {
    return;
  }
  new Vue({
    data: {
      isShown: $switch.checked,
    },
    created() {
      this.setVisibility(this.isShown);
      this.opacity();
      $switch.onclick = this.toggle.bind(this);
      $opacity.oninput = this.opacity.bind(this);
    },
    methods: {
      opacity() {
        $cover.style.opacity = ($opacity.value / 100).toString();
      },
      setVisibility(visibility) {
        this.isShown = visibility;
        $switch.checked = visibility;
        $cover.hidden = !visibility;
        $opacity.disabled = !visibility;
      },
      toggle() {
        this.setVisibility(!this.isShown);
      },
    },
  });
});
