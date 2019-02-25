<template>
  <article>
    <header>
      <h1>{{ board.title }}</h1>

      <nav>
        <ul>
          <li>
            <router-link :to="`/boards/${board.id}`">View</router-link>
          </li>

          <li>
            <a href="#">Manage</a>
          </li>
        </ul>
      </nav>
    </header>

    <main>
      <!-- <p>Board has {{ board.counts.lists }} lists with {{ board.counts.cards }} cards.</p> -->
    </main>
  </article>
</template>

<script>
export default {
  props: ["board"]
};
</script>