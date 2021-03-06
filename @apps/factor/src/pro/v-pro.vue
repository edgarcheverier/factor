<template>
  <div class="view-pro">
    <section-splash />

    <section class="benefits content">
      <h2 class="title">Why you'll love being Pro...</h2>
      <section-benefits class="content-pad" />
    </section>

    <section
      v-for="(feature, index) in features"
      :id="feature.id"
      :key="index"
      class="features content"
      :data-test="`feature-` + index"
      :class="[index == features.length - 1 ? 'last' : '']"
    >
      <div class="split-feature" :class="[index % 2 == 0 ? 'even' : 'odd']">
        <div class="feature-figure-container">
          <div v-if="feature.figure" class="figure-container">
            <component :is="feature.figure" />
          </div>
        </div>
        <div class="feature-content-container">
          <div class="feature-content">
            <h2 v-formatted-text="feature.title" class="title" />
            <div class="text">{{ feature.text }}</div>
            <div v-if="feature.link" class="action">
              <factor-link :path="feature.link.path">{{ feature.link.text }} &rarr;</factor-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="quotes content">
      <div class="content-pad quotes-pad">
        <article
          v-for="(quote, index) in quotes"
          :key="index"
          itemprop="review"
          itemscope
          itemtype="http://schema.org/Review"
        >
          <blockquote itemprop="reviewRating" itemscope itemtype="http://schema.org/Review">
            <p class="quote-body" itemprop="reviewBody">"{{ quote.text }}"</p>
            <footer>
              <div class="quote-media">
                <a class="quote-image" :href="quote.link">
                  <img :src="quote.img" alt="quote" />
                </a>
              </div>
              <a
                :href="quote.link"
                target="_blank"
                itemprop="author"
                itemscope
                itemtype="https://schema.org/Person"
              >{{ quote.attribution }}</a>
            </footer>
          </blockquote>
        </article>
      </div>
    </section>

    <el-cta id="cta" />
  </div>
</template>

<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"

export default {
  components: {
    factorLink,
    factorIcon,
    sectionSplash: () => import("./splash.vue"),
    sectionBenefits: () => import("./section-benefits.vue"),
    elCta: () => import("./el-cta.vue"),
  },
  data(this: any) {
    return {
      loading: true,
      loadingButtons: true,
      features: [
        {
          title: `Dashboard <span class="pro">Pro</span>`,
          text: `The professional suite enables special pro-level features on Factor's CMS dashboard.`,
          figure: () => import("./figure-dashboard.vue"),
          link: { path: "/plans", text: "Start Now" },
        },
        {
          title: `Extensions <span class="pro">Pro</span>`,
          text: `Want to take your applications to the next level? The Pro suite enabled Pro versions of many Factor plugins.`,
          figure: () => import("./figure-extensions.vue"),
          link: { path: "/plans", text: "Start Now" },
        },
        {
          title: `Support <span class="pro">Pro</span>`,
          text: `Lorem ipsum sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.`,
          figure: () => import("./figure-support.vue"),
          link: { path: "/plans", text: "Start Now" },
        },
      ],
      quotes: [
        {
          text: `Factor gives me the right technology and a robust set of extensions. Factor Pro helps me build and get paid faster.`,
          attribution: "Patrick Abner , Full-stack Developer",
          img: require("./img/patrick.jpg"),
        },
        {
          text: `What I like about Factor pro are the extensions that just keep on coming, they save time and are easy to customize.`,
          attribution: "Melissa Flick, Developer",
          img: require("./img/melissa.jpg"),
        },
        {
          text: `Creating powerful apps takes minutes, I spend less time integrating and customizing is quite simple.`,
          attribution: "Joshua Carter, Front-end Developer",
          img: require("./img/joshua.jpg"),
        },
        {
          text: `Great documentation and support. The advanced features and settings with Factor pro make it easy.`,
          attribution: "Daniel Turner, Software Developer",
          img: require("./img/daniel.jpg"),
        },
      ],
    }
  },
  mounted(this: any) {
    setTimeout(() => {
      this.loadingButtons = false
    }, 1000)
  },
  methods: {},
  metaInfo() {
    return {
      title: "JavaScript CMS and eCommerce Platform",
      description:
        "Factor is the leading extension-focused JavaScript CMS and eCommerce platform that helps you build websites, blogs, and eCommerce. Built with Vue, Express, Node, MongoDb and natively Typescript.",
    }
  },
}
</script>
<style lang="less">
.view-pro {
  overflow: hidden;
  .content-pad {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5em;
    width: 100%;
    z-index: 10;
    position: relative;
  }

  .benefits {
    h2.title {
      font-size: 1.5em;
      text-align: center;
      font-weight: var(--font-weight-bold, 700);
    }
    .content-pad {
      padding-top: 3rem;
      padding-bottom: 3rem;
      @media (max-width: 900px) {
        padding-top: 6rem;
        padding-bottom: 3rem;
      }
    }
  }

  .features {
    &.content {
      &.last {
        box-shadow: none;
      }
      @media (max-width: 900px) {
        padding: 4rem 0;
        box-shadow: none;
      }
    }
    .split-feature {
      display: grid;
      grid-column-gap: 3rem;
      grid-template-columns: 1fr 1fr;
      grid-template-areas: "a b";
      align-items: center;

      &.even {
        .feature-content-container {
          justify-self: flex-end;
        }
      }
      &.odd {
        grid-template-areas: "b a";
        .feature-figure-container {
          justify-content: flex-end;
          @media (max-width: 900px) {
            justify-content: center;
          }
        }
      }
      .feature-content-container {
        grid-area: a;
        min-width: 0;
        .feature-content {
          padding: 10rem 1.5rem;
          max-width: 550px;
        }
      }
      .feature-figure-container {
        grid-area: b;
        min-width: 0; // defaults content width
        height: 100%;
        position: relative;
        // width: 100%;
        display: flex;
        align-items: center;
        .figure-container {
          max-width: 100%;
        }
      }
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-template-areas: "a" "b";
        &.odd {
          grid-template-areas: "a" "b";
        }
        .feature-content-container {
          .feature-content {
            padding: 3rem 1.5rem 1rem;
            max-width: 100%;
          }
        }
        .feature-figure-container {
          justify-content: center;
        }
      }
    }

    .title {
      font-weight: 700;
      font-size: 3em;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      .pro {
        color: var(--color-text-secondary);
      }
    }
    .text {
      font-weight: 400;
      font-size: 1.4em;
      line-height: 1.6;
      margin-bottom: 1rem;

      color: var(--color-text-secondary);
    }
    .action {
      font-weight: 500;
      font-size: 1.3em;
    }
    @media (max-width: 900px) {
      .title {
        font-size: 1.8em;
      }
      .text {
        font-size: 1.1em;
      }
    }
  }

  .quotes {
    padding: 6rem 0 4rem;
    .quotes-pad {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 900px) {
      .quotes-pad {
        grid-template-columns: 1fr;
        article {
          margin: 0 auto;
          blockquote {
            padding: 2rem 0;
          }
        }
      }
    }
    article {
      position: relative;
      display: flex;

      blockquote {
        width: 100%;
        max-width: 550px;
        padding: 2rem;
        font-size: 1.1em;
        line-height: 1.8;
        background: #fff;

        .quote-body {
          padding: 2rem;
          box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2);
          border-radius: 6px 6px 6px 0;
          transition: all 0.1s cubic-bezier(0.4, 0, 0, 1);

          &:hover {
            box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2),
              0 14px 32px rgba(50, 50, 93, 0.1);
          }
        }

        .quote-media {
          display: block;
          text-align: center;
          a {
            display: block;
            width: 40px;

            img {
              display: block;
              width: 100%;
              border-radius: 50%;
            }
          }
        }
        footer {
          display: grid;
          grid-template-columns: 1fr 6fr;
          align-items: center;
          margin-top: 1rem;
          font-size: 0.8em;
          font-weight: 500;
          a {
            color: inherit;
          }
        }
      }
    }
  }
}
</style>
