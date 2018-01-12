<template>
  <section id="description">
    <div class="details">
      <div> {{ content || sentence }} </div>
    </div>
    <div class="links">
      <div class="link what">
        <a
         href="https://likecoin.foundation/#/"
         target="_blank"
         rel="noopener noreferrer"
        >
          {{ buttonWhat }}
        </a>
      </div>
    </div>
  </section>
</template>


<script>
export default {
  name: 'description',
  props: ['content'],
  data() {
    return {
      sentence: 'Great! Seem you already have a Metamask wallet. Now your are ready to receive or send LikeCoin.',
      buttonWhat: 'What are LikeCoin?',
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/index.scss";

#description {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 40px;

  .details {
    text-align: left;
    padding-right: 16px;

    font-size: 20px;
    line-height: 30px;
    flex: 2;

    > div {
      margin-top: 68px;
      max-width: 528px;
      span {
        &.highlight {
          color: $like-red;
        }
        &.bold {
          font-weight: bold;
        }
      }
    }
  }

  .links {
    flex: 1;
    margin-top: -134px;
    .link {
      flex: 1;
      height: 60px;
      text-align: left;
      padding: 16px;
      display: flex;
      font-size: 24px;
      align-items: center;

      transition: opacity .2s ease-in-out;

      &.what {
        background-image: linear-gradient(63deg, $like-gradient-2 2%, $like-gradient-3 99%);
      }

      &:hover {
        opacity: 0.8;
      }

      > a {
        color: $like-white;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}

@media (max-width: 1024px) {
  #description {
    .details {
      > div {
        margin-top: 44px;
      }
    }
    .links {
      margin-top: -88px;
    }
  }
}

@media (max-width: 768px) {
  body #description {
    flex-direction: column;
    margin-top: 36px !important;
    padding: 0;

    .details {
      flex: 1;
      line-height: 28px;
      font-size: 18px;
    }

    .links {
      margin: 12px 0;
      .link {
        width: 244px;
        margin: 12px 0;
        justify-content: center;
        height: 44px;
        font-size: 22px;
      }
    }
  }
}

@media (max-width: 500px) {
  body #description {
    padding: 0 16px;
  }
}
</style>
