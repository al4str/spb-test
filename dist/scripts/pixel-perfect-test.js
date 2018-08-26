
window.onload = () => {
  const $cover = document.getElementById('cover');
  const $switch = document.getElementById('switch');
  const $opacity = document.getElementById('opacity');
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
};
