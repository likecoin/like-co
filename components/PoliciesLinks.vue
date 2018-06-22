<template>
  <div class="policies-links">
    <ul>
      <!-- <li>
        <nuxt-link :to="{ name: 'in-policies-terms' }">
          {{ $t('TermsOfUsePage.title') }}
        </nuxt-link>
      </li> -->
      <li>
        <nuxt-link :to="{ name: 'in-policies-privacy' }">
          {{ $t('PrivacyPolicyPage.title') }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'policies-links',
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.policies-links {
  ul {
    margin: -8px -16px;
    padding: 0;

    list-style: none;

    @media (min-width: 600px + 1px) {
      display: flex;
      flex-wrap: wrap;
    }

    li {
      padding: 8px 16px;

      a {
        text-decoration: underline;

        color: $like-gray-4;

        font-size: 12px;
      }
    }
  }
}
</style>
